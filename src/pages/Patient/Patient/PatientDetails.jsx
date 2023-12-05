// Packages
import { useState } from "react";
import Skeleton from "react-loading-skeleton";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Components
import { Column } from "../components/Column";
import { StatusBtn } from "../components/StatusBtn";
import { ImageModal } from "../components/ImageModal";
import { Button } from "../../../components/ui/Button";
import { Transparent } from "../../../components/ui/Container";
import { CustomModal } from "../../../components/ui/Modal/Modal";

// Utility & services
import client from "../../../utils/auth";
import {
  theadDoctorDetails,
  theadDrugDetails
} from "../../../utils/dataObject";
import {
  useGetAllDoctorTransaction,
  useGetAllMedicineTransaction,
  useGetPatientsDetails
} from "../../../services/patient-services";
import { formatDate } from "../../../utils/helpers";
import useForm from "../../../hooks/useForm";

export const PatientDetails = () => {
  const [modalDelete, setModalDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  let { userId } = useParams();
  const {
    dataUser,
    isPending,
  } = useGetPatientsDetails(userId);
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      setLoading(true);
      const res = await client.delete(`/admins/user/${userId}`);
      if (res?.status === 200) {
        navigate('/patients/data')
        toast.success('Anda berhasil menghapus pasien!', {
          delay: 800
        });
      } else {
        throw new Error('Gagal menghapus data pasien!');
      }
    } catch (error) {
      toast.error(error.message, {
        delay: 800
      });
    } finally {
      setLoading(false);
      setModalDelete(false);
    }
  }


  return (
    <>
      <section className="mx-4">
        <table className="row">
          <tbody className="col-12 col-lg-6">
            {dataUser?.slice(0, 4)?.map((item, index) => (
              <tr key={index} className="d-flex">
                <td className="fw-semibold fs-2 title-width">{item.label}</td>
                <td className="w-auto">
                  {isPending
                    ? <Skeleton height={20} width={200} />
                    : item.value
                  }
                </td>
              </tr>
            ))}
          </tbody>
          <tbody className="col-12 col-lg-6">
            {dataUser?.slice(4)?.map((item, index) => (
              <tr key={index} className=" d-flex">
                <td className=" fw-semibold fs-2 title-width">{item.label}</td>
                {isPending
                  ? <Skeleton height={20} width={200} />
                  : item.value
                }
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="mx-4 mt-5 d-flex flex-column gap-5">
        <TableDoctorDetails />
        <TableDrugDetails />
      </section>

      <section className="d-flex justify-content-center gap-3 my-5 sticky-bottom z-0 bg-base py-3">
        <Link to={'/patients/data'} className="btn btn-primary text-white w-8 fw-semibold">
          Kembali
        </Link>
        <Button
          onClick={() => setModalDelete(true)}
          className={'btn-outline-primary w-8 fw-semibold border-2'}>Hapus</Button>
      </section>

      {modalDelete &&
        <Transparent
          disabled={true}
          className='min-vw-100 start-0 position-fixed end-0'
        >
          <CustomModal
            disabled={loading}
            title={'Hapus Pasien?'}
            content={'Apabila anda menghapus Pasien, maka data Pasien akan hilang'}
            confirmAction={handleDelete}
            cancelAction={() => setModalDelete(false)}
          />
        </Transparent>
      }
    </>
  )
}

const TableDoctorDetails = () => {
  const {
    data,
    refetch,
    isPending,
    isError
  } = useGetAllDoctorTransaction();
  const initState = {
    modalImg: false,
    imageSrc: null
  }
  const {
    form,
    setForm,
  } = useForm(initState);
  const handleModalLink = (src) => {
    setForm((prev) => ({
      ...prev,
      modalImg: true,
      imageSrc: src
    }))
  }
  
  const closeModal = () => {
    setForm((prev) => ({
      ...prev,
      modalImg: false
    }))
  }

  return (
    <>
      <TableDetailsContainer
        thead={theadDoctorDetails}
        title={'Transaksi Konsultasi Dokter'}
      >
        <Column
          isError={isError}
          isPending={isPending}
          refetch={refetch}
          data={data}
          search={''}
          renderItem={(data, index) => {
            const date = formatDate(data?.created_at);
            const subTotal = data?.price?.toLocaleString('ID-id');
            return (
              <tr className="text-nowrap" key={index}>
                <td>{data?.transaction_id}</td>
                <td>{data?.Doctor_id}</td>
                <td className="text-capitalize">{data?.payment_method}</td>
                <td>{`Rp ${subTotal}`}</td>
                <td>{date}</td>
                <td>
                  {!data?.payment_confirmation
                    ? '-'
                    : <Button
                      className={'p-0 text-primary fw-semibold'}
                      onClick={() => handleModalLink(data?.payment_confirmation)}>Link</Button>
                  }
                </td>
                <td className="d-flex justify-content-center">
                  <StatusBtn
                    id={data?.transaction_id}
                    status={data?.payment_status}
                  />
                </td>
              </tr>
            )
          }
          }
        />
      </TableDetailsContainer>
      {form.modalImg &&
        <ImageModal 
          closeModal={closeModal} 
          source={form.imageSrc} />
      }
    </>
  )
}
const TableDrugDetails = () => {
  const {
    data,
    refetch,
    isPending,
    isError
  } = useGetAllMedicineTransaction();
  
  const initState = {
    modalImg: false,
    imageSrc: null
  }
  const {
    form,
    setForm,
  } = useForm(initState);
  const handleModalLink = (src) => {
    setForm((prev) => ({
      ...prev,
      modalImg: true,
      imageSrc: src
    }))
  }
  
  const closeModal = () => {
    setForm((prev) => ({
      ...prev,
      modalImg: false
    }))
  }

  return (
    <>
      <TableDetailsContainer
        thead={theadDrugDetails}
        title={'Transaksi Pembelian Obat'}
      >
        <Column
          isError={isError}
          isPending={isPending}
          refetch={refetch}
          data={data}
          search={''}
          renderItem={(item, index) => {
            const date = formatDate(item?.created_at)
            return (
              <tr className="text-capitalize text-nowrap" key={index}>
                <td>{item?.id}</td>
                <td>{item?.medicine_transaction?.payment_method}</td>
                <td>{`Rp ${item?.medicine_transaction?.total_price.toLocaleString('ID-id')}`}</td>
                <td>{date}</td>
                <td>
                  {!item?.payment_confirmation
                    ? '-'
                    : <Button
                      className={'p-0 text-primary fw-semibold'}
                      onClick={() => handleModalLink(item?.payment_confirmation)}>Link</Button>
                  }
                </td>
                <td className="d-flex justify-content-center">
                  <StatusBtn 
                    id={item?.id}
                    status={item?.payment_status} />
                </td>
              </tr>
            )
          }
          }
        />
      </TableDetailsContainer>
      {form.modalImg &&
        <ImageModal 
          closeModal={closeModal} 
          source={form.imageSrc} />
      }
    </>
  )
}

const TableDetailsContainer = ({ thead, title, children }) => {
  return (
    <>
      <div>
        <h6 className="fw-semibold fs-2 m-0 mb-2">{title}</h6>
        <div className=" table-responsive table-wrapper" style={{ maxHeight: '15rem' }}>
          <table className="table table-borderless table-striped" >
            <thead className=' sticky-top z-0'>
              <tr>
                {thead?.map((item, index) => (
                  <th
                    key={index}
                    className={`fw-semibold text-nowrap ${item === 'Status' && 'text-center'}`}
                    scope="col">
                    {item}
                  </th>
                ))
                }
              </tr>
            </thead>
            <tbody>
              {children}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}